export class Category {
    categoryId: number;
    parentCategoryId: number;
    categoryName: string;
    description: string;
    subCategories: Category[];
}