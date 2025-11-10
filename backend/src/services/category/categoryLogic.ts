/**
 * @summary
 * Business logic for category management operations
 *
 * @module services/category
 */

import {
  CategoryCreateRequest,
  CategoryCreateResponse,
  CategoryUpdateRequest,
  CategoryEntity,
} from './categoryTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * In-memory category storage
 */
const categories: Map<string, CategoryEntity> = new Map();

/**
 * Maximum categories per user
 */
const MAX_CATEGORIES_PER_USER = 50;

/**
 * Maximum nesting levels
 */
const MAX_NESTING_LEVELS = 3;

/**
 * Default categories configuration
 */
const DEFAULT_CATEGORIES = [
  { name: 'Trabalho', color: '#e74c3c' },
  { name: 'Pessoal', color: '#3498db' },
  { name: 'Urgente', color: '#f39c12' },
  { name: 'Compras', color: '#2ecc71' },
  { name: 'Saúde', color: '#9b59b6' },
];

/**
 * @summary
 * Initializes default categories for a new user
 *
 * @function initializeDefaultCategories
 * @module services/category
 *
 * @param {string} idUser - User identifier
 *
 * @returns {void}
 */
export function initializeDefaultCategories(idUser: string): void {
  const existingDefaults = Array.from(categories.values()).filter(
    (cat) => cat.idUser === idUser && cat.isDefault
  );

  if (existingDefaults.length > 0) {
    return;
  }

  DEFAULT_CATEGORIES.forEach((defaultCat, index) => {
    const idCategory = uuidv4();
    const dateCreated = new Date();

    const category: CategoryEntity = {
      idCategory,
      idUser,
      name: defaultCat.name,
      color: defaultCat.color,
      description: null,
      isDefault: true,
      parentCategoryId: null,
      order: index,
      dateCreated,
      dateUpdated: dateCreated,
    };

    categories.set(idCategory, category);
  });
}

/**
 * @summary
 * Calculates the nesting level of a category
 *
 * @function calculateNestingLevel
 * @module services/category
 *
 * @param {string | null} parentCategoryId - Parent category identifier
 * @param {string} idUser - User identifier
 *
 * @returns {number} Nesting level
 */
function calculateNestingLevel(parentCategoryId: string | null, idUser: string): number {
  if (!parentCategoryId) {
    return 0;
  }

  let level = 1;
  let currentParentId: string | null = parentCategoryId;

  while (currentParentId) {
    const parent = categories.get(currentParentId);
    if (!parent || parent.idUser !== idUser) {
      break;
    }
    currentParentId = parent.parentCategoryId;
    level++;
  }

  return level;
}

/**
 * @summary
 * Creates a new category with validation and default values
 *
 * @function categoryCreate
 * @module services/category
 *
 * @param {CategoryCreateRequest} params - Category creation parameters
 * @param {string} params.idUser - User identifier
 * @param {string} params.name - Category name
 * @param {string} params.color - Category color
 * @param {string} [params.description] - Category description
 * @param {string} [params.parentCategoryId] - Parent category identifier
 *
 * @returns {Promise<CategoryCreateResponse>} Created category entity
 *
 * @throws {Error} When name is duplicated for the user
 * @throws {Error} When maximum categories limit is reached
 * @throws {Error} When maximum nesting level is reached
 * @throws {Error} When parent category is not found
 */
export async function categoryCreate(
  params: CategoryCreateRequest
): Promise<CategoryCreateResponse> {
  /**
   * @validation Check for duplicate name for the same user
   * @throw {duplicateNameError}
   */
  const existingCategory = Array.from(categories.values()).find(
    (cat) => cat.name === params.name && cat.idUser === params.idUser
  );

  if (existingCategory) {
    throw new Error('duplicateNameError');
  }

  /**
   * @validation Check maximum categories limit
   * @throw {maxCategoriesError}
   */
  const userCategories = Array.from(categories.values()).filter(
    (cat) => cat.idUser === params.idUser && !cat.isDefault
  );

  if (userCategories.length >= MAX_CATEGORIES_PER_USER) {
    throw new Error('maxCategoriesError');
  }

  /**
   * @validation Validate parent category exists if provided
   * @throw {parentNotFoundError}
   */
  if (params.parentCategoryId) {
    const parentCategory = categories.get(params.parentCategoryId);
    if (!parentCategory || parentCategory.idUser !== params.idUser) {
      throw new Error('parentNotFoundError');
    }

    /**
     * @validation Check maximum nesting level
     * @throw {maxNestingError}
     */
    const nestingLevel = calculateNestingLevel(params.parentCategoryId, params.idUser);
    if (nestingLevel >= MAX_NESTING_LEVELS) {
      throw new Error('maxNestingError');
    }
  }

  /**
   * @rule {RU-001,RU-002} Generate unique category identifier
   */
  const idCategory = uuidv4();

  /**
   * @rule {RU-014} Generate creation timestamp
   */
  const dateCreated = new Date();

  /**
   * @rule {RU-013} Calculate display order
   */
  const userCategoriesCount = Array.from(categories.values()).filter(
    (cat) => cat.idUser === params.idUser
  ).length;

  const newCategory: CategoryEntity = {
    idCategory,
    idUser: params.idUser,
    name: params.name,
    color: params.color,
    description: params.description !== undefined ? params.description : null,
    isDefault: false,
    parentCategoryId: params.parentCategoryId !== undefined ? params.parentCategoryId : null,
    order: userCategoriesCount,
    dateCreated,
    dateUpdated: dateCreated,
  };

  categories.set(idCategory, newCategory);

  return newCategory;
}

/**
 * @summary
 * Retrieves all categories for a specific user
 *
 * @function categoryList
 * @module services/category
 *
 * @param {string} idUser - User identifier
 *
 * @returns {Promise<CategoryEntity[]>} List of user categories
 */
export async function categoryList(idUser: string): Promise<CategoryEntity[]> {
  return Array.from(categories.values())
    .filter((cat) => cat.idUser === idUser)
    .sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return a.order - b.order;
    });
}

/**
 * @summary
 * Retrieves a specific category by ID
 *
 * @function categoryGet
 * @module services/category
 *
 * @param {string} idCategory - Category identifier
 * @param {string} idUser - User identifier
 *
 * @returns {Promise<CategoryEntity | null>} Category entity or null if not found
 */
export async function categoryGet(
  idCategory: string,
  idUser: string
): Promise<CategoryEntity | null> {
  const category = categories.get(idCategory);

  if (!category || category.idUser !== idUser) {
    return null;
  }

  return category;
}

/**
 * @summary
 * Updates an existing category
 *
 * @function categoryUpdate
 * @module services/category
 *
 * @param {string} idCategory - Category identifier
 * @param {CategoryUpdateRequest} params - Update parameters
 *
 * @returns {Promise<CategoryEntity>} Updated category entity
 *
 * @throws {Error} When category is not found
 * @throws {Error} When trying to modify default category name
 * @throws {Error} When name is duplicated
 */
export async function categoryUpdate(
  idCategory: string,
  params: CategoryUpdateRequest
): Promise<CategoryEntity> {
  const category = categories.get(idCategory);

  /**
   * @validation Check if category exists and belongs to user
   * @throw {categoryNotFoundError}
   */
  if (!category || category.idUser !== params.idUser) {
    throw new Error('categoryNotFoundError');
  }

  /**
   * @validation Check if trying to modify default category name
   * @throw {defaultCategoryError}
   */
  if (category.isDefault && params.name && params.name !== category.name) {
    throw new Error('defaultCategoryError');
  }

  /**
   * @validation Check for duplicate name if name is being changed
   * @throw {duplicateNameError}
   */
  if (params.name && params.name !== category.name) {
    const existingCategory = Array.from(categories.values()).find(
      (cat) =>
        cat.name === params.name && cat.idUser === params.idUser && cat.idCategory !== idCategory
    );

    if (existingCategory) {
      throw new Error('duplicateNameError');
    }
  }

  /**
   * @rule {RU-015} Update modification timestamp
   */
  const dateUpdated = new Date();

  const updatedCategory: CategoryEntity = {
    ...category,
    name: params.name !== undefined ? params.name : category.name,
    color: params.color !== undefined ? params.color : category.color,
    description: params.description !== undefined ? params.description : category.description,
    order: params.order !== undefined ? params.order : category.order,
    dateUpdated,
  };

  categories.set(idCategory, updatedCategory);

  return updatedCategory;
}

/**
 * @summary
 * Deletes a category
 *
 * @function categoryDelete
 * @module services/category
 *
 * @param {string} idCategory - Category identifier
 * @param {string} idUser - User identifier
 * @param {string | null} moveToCategory - Target category to move tasks to
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} When category is not found
 * @throws {Error} When trying to delete default category
 */
export async function categoryDelete(
  idCategory: string,
  idUser: string,
  moveToCategory: string | null
): Promise<void> {
  const category = categories.get(idCategory);

  /**
   * @validation Check if category exists and belongs to user
   * @throw {categoryNotFoundError}
   */
  if (!category || category.idUser !== idUser) {
    throw new Error('categoryNotFoundError');
  }

  /**
   * @validation Check if trying to delete default category
   * @throw {defaultCategoryError}
   */
  if (category.isDefault) {
    throw new Error('defaultCategoryError');
  }

  /**
   * @rule {BR-003} Handle task reassignment (implementation depends on task-category integration)
   */

  categories.delete(idCategory);
}
