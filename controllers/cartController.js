const User=require('../model/userSchema')
const Cart=require('../model/cartSchema')
const Product=require('../model/productSchema')

const getCart=async (req,res)=>{
    try{
        const _id=req.user
        const user = await User.findById(req.user._id);
        const email = user.toObject().email;
        let userCart=await Cart.findOne({email: email})
        if(userCart){
            const cart=userCart.cart
            const cartWithoutId=cart.map((product)=>{
                const {_id,...productWithoutId}=product.toObject()
                return productWithoutId
            })
            res.status(200).json({
                error:false,
                message:'Cart successfully fetched',
                cart: cartWithoutId
            })
        }
        else{
            res.status(400).json({
                error:true,
                message:'Empty Cart'
            })
        }

    }catch (error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const addToCart=async (req,res)=>{
    try{
        const {quantityToAdd}=req.query
        let quantityInt = parseInt(quantityToAdd);
        const productDoc=new Product(req.body)
        const product=productDoc.toObject()
        const productId= product.productId
        const maxQuantity=product.quantity

        const _id=req.user
        const user = await User.findById(req.user._id);
        const email = user.toObject().email;
        let userCart=await Cart.findOne({email: email})
        let updatedQuantity=0

        console.log(userCart)
        if(userCart){
            console.log('Check')
            const existingProductIndex = userCart.cart.findIndex(item => item.product.productId===productId);

            if (existingProductIndex !== -1) {
                const existingProductQuantity=userCart.cart[existingProductIndex].quantity
                if(!isNaN(quantityInt)){
                    if(quantityInt===-1){
                        userCart.cart[existingProductIndex].quantity-=1;
                        updatedQuantity=userCart.cart[existingProductIndex].quantity
                        if(userCart.cart[existingProductIndex].quantity<=0){
                            console.log(userCart.cart[existingProductIndex].quantity)
                            userCart.cart.splice(existingProductIndex,1)
                            updatedQuantity=0
                        }
                    }
                    else{
                        userCart.cart[existingProductIndex].quantity=quantityToAdd
                        updatedQuantity=userCart.cart[existingProductIndex].quantity
                    }
                }
                else{
                    if(existingProductQuantity<maxQuantity){
                        userCart.cart[existingProductIndex].quantity+=1;
                        updatedQuantity=userCart.cart[existingProductIndex].quantity
                    }
                    else{
                        userCart.cart[existingProductIndex].quantity=maxQuantity
                        return res.status(201).json({
                            error:false,
                            message:'Maximum items in cart',
                            cart:{
                                product: product,
                                quantity: maxQuantity
                            }
                        })
                    }
                }
            } else {
                console.log('Check')
                if(!isNaN(quantityInt)){
                    userCart.cart.push({
                        product: product,
                        quantity: quantityToAdd
                    });
                    updatedQuantity=quantityToAdd
                }
                else{
                    userCart.cart.push({
                        product: product,
                        quantity: 1
                    });
                    updatedQuantity=1
                }
            }
        }
        else{
            userCart= new Cart({
                email,
                cart:[{
                    product: productDoc,
                    quantity: 1
                }]
            })
        }

        console.log(userCart.cart)
        await userCart.save();
        return res.status(201).json({
            error:false,
            message:'Product added to cart successfully',
            cart:{
                product: product,
                quantity: updatedQuantity
            }
        })
    } catch(error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const removeFromCart=async (req,res)=>{
    try{
        const productId=req.body.productId

        const user = await User.findById(req.user._id);
        const email = user.toObject().email;

        const updatedCart = await Cart.findOneAndUpdate(
            { email: email },
            { $pull: { cart: { 'product.productId': productId } } },
            { new: true }
        );
        res.status(201).json({message:'Product removed successfully'})
    } catch (error){
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports={
    getCart,
    addToCart,
    removeFromCart
}