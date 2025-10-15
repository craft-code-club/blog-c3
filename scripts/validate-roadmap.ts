#!/usr/bin/env tsx
/**
 * Roadmap YAML Validation Script
 * 
 * Usage:
 *   npx tsx scripts/validate-roadmap.ts
 *   npx tsx scripts/validate-roadmap.ts _content/roadmap/custom.yml
 * 
 * This script validates roadmap YAML files before build time.
 * It checks:
 * - YAML syntax
 * - Required fields (category title, item title/description)
 * - Link URL validity
 * - Icon types
 * - Target attributes
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { RoadmapSchema } from '../src/lib/types/roadmap';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function validateRoadmapFile(filePath: string): boolean {
  log(`\n🔍 Validating: ${filePath}`, colors.cyan);
  
  try {
    // Check file exists
    if (!fs.existsSync(filePath)) {
      log(`✗ File not found: ${filePath}`, colors.red);
      return false;
    }

    // Read file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse YAML
    let parsedData: any;
    try {
      parsedData = yaml.load(fileContent);
    } catch (yamlError: any) {
      log(`✗ YAML Syntax Error:`, colors.red);
      log(`  ${yamlError.message}`, colors.red);
      return false;
    }

    // Validate with Zod schema
    const result = RoadmapSchema.safeParse(parsedData);
    
    if (!result.success) {
      log(`✗ Validation Failed:`, colors.red);
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(' → ');
        log(`  [${path}] ${issue.message}`, colors.red);
      });
      return false;
    }

    // Success - print statistics
    const data = result.data;
    const totalItems = data.categories.reduce((sum, cat) => sum + cat.items.length, 0);
    const totalLinks = data.categories.reduce(
      (sum, cat) => sum + cat.items.reduce(
        (itemSum, item) => itemSum + (item.links?.length || 0), 
        0
      ), 
      0
    );

    log(`✓ Validation Passed`, colors.green);
    log(`  📊 Statistics:`, colors.blue);
    log(`     Categories: ${data.categories.length}`, colors.blue);
    log(`     Items: ${totalItems}`, colors.blue);
    log(`     Links: ${totalLinks}`, colors.blue);
    
    return true;

  } catch (error: any) {
    log(`✗ Unexpected Error:`, colors.red);
    log(`  ${error.message}`, colors.red);
    return false;
  }
}

// Main execution
const args = process.argv.slice(2);
const defaultPath = '_content/roadmap/dsa.yml';
const filesToValidate = args.length > 0 ? args : [defaultPath];

log('🚀 Roadmap YAML Validator', colors.cyan);
log('═'.repeat(50), colors.cyan);

let allValid = true;

for (const file of filesToValidate) {
  const fullPath = path.resolve(process.cwd(), file);
  const isValid = validateRoadmapFile(fullPath);
  
  if (!isValid) {
    allValid = false;
  }
}

log('\n' + '═'.repeat(50), colors.cyan);

if (allValid) {
  log('✓ All files valid!', colors.green);
  process.exit(0);
} else {
  log('✗ Validation failed for one or more files', colors.red);
  process.exit(1);
}
