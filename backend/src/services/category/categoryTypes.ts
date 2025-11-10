/**
 * @summary
 * Type definitions for category management operations
 *
 * @module services/category
 */

/**
 * Category entity interface
 */
export interface CategoryEntity {
  idCategory: string;
  idUser: string;
  name: string;
  color: string;
  description: string | null;
  isDefault: boolean;
  parentCategoryId: string | null;
  order: number;
  dateCreated: Date;
  dateUpdated: Date;
}

/**
 * Category creation request parameters
 */
export interface CategoryCreateRequest {
  idUser: string;
  name: string;
  color: string;
  description?: string | null;
  parentCategoryId?: string | null;
}

/**
 * Category creation response
 */
export interface CategoryCreateResponse {
  idCategory: string;
  idUser: string;
  name: string;
  color: string;
  description: string | null;
  isDefault: boolean;
  parentCategoryId: string | null;
  order: number;
  dateCreated: Date;
  dateUpdated: Date;
}

/**
 * Category update request parameters
 */
export interface CategoryUpdateRequest {
  idUser: string;
  name?: string;
  color?: string;
  description?: string | null;
  order?: number;
}
