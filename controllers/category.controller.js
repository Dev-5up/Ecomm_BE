const category_model=require('../models/category.model')
exports.createNewCategory = async (req,res) => {
    const cat_data={
        name: req.body.name,
        description: req.body.description
    }
try {
    const category= await category_model.create(cat_data)
    res.status(201).send(category)//user response on creation is 201.
} catch (error) {
    console.log("Error while creating category",error);
    return res.status(500).send({
        message:"Error occured while creating category."
    }) //category creation failure response is 500.
}
}