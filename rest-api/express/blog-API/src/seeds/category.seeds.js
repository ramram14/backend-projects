/**
import Category from '../models/category.model.js';
import connectDB from '../config/db.js';

async function seed() {
   try {
    await connectDB();

    const categories = ['Lifestyle', 'Hoby', 'Technology', 'Fashion', 'Gaming', 'Health', 'Business', 'Education', 'Philosophy', 'Other'];

    await Category.insertMany(categories.map(category => ({ name: category })));

    console.log('Categories seeded successfully');
   } catch (error) {
    console.log(Error);
   }
}

seed();
*/