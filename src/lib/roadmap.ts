/**
 * DSA Roadmap Data Loader
 * 
 * This module handles loading and validating the DSA roadmap from YAML configuration.
 * It uses Zod schemas to ensure data integrity at build time.
 * 
 * @module roadmap
 */

import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { RoadmapSchema, type Roadmap } from './types/roadmap';
import { ZodError } from 'zod';

/**
 * Loads and validates the DSA roadmap from YAML configuration
 * 
 * This function runs at build time during static site generation.
 * If the YAML is invalid or missing required fields, the build will fail
 * with clear error messages indicating what needs to be fixed.
 * 
 * @throws {Error} If file not found or validation fails
 * @returns Validated roadmap data structure
 */
export function loadDSARoadmap(): Roadmap {
  try {
    const filePath = path.join(process.cwd(), '_content/roadmap/dsa.yml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse YAML
    const data = yaml.load(fileContents);
    
    // Validate with Zod schema
    const roadmap = RoadmapSchema.parse(data);
    
    return roadmap;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('❌ DSA Roadmap validation failed:');
      console.error('File: _content/roadmap/dsa.yml\n');
      
      error.issues.forEach((err, index) => {
        const pathStr = err.path.join(' → ');
        console.error(`${index + 1}. ${pathStr}`);
        console.error(`   Error: ${err.message}\n`);
      });
      
      throw new Error(
        'Invalid roadmap configuration. Please fix errors in _content/roadmap/dsa.yml'
      );
    }
    
    // Handle file not found or other errors
    if (error instanceof Error) {
      console.error('❌ Failed to load DSA roadmap:', error.message);
    }
    
    throw error;
  }
}
