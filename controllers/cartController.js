const User=require('../model/userSchema')
const Cart=require('../model/cartSchema')
const Product=require('../model/productSchema')

const getCart=async (req,res)=>{
    try{
        const user = await User.findById(req.user._id);
        const userId = user.toObject().userId;
        let userCart=await Cart.findOne({userId: userId})
        if(userCart){
            const cart=userCart.cart
            const productIds=cart.map(
                (cartItem)=>{
                    const {productId, quantity}=cartItem
                    return productId
                }
            )
            const products=await Product.find({productId: {$in: productIds}}).select('-__v')
            let areSomeOutOfStock=false
            const cartWithoutId=cart.map(
                (cartItem)=>{
                    const {productId, quantity}=cartItem
                    const product=products.find((product)=>product.productId===productId)
                    if(product){
                        return {
                            product: product,
                            quantity: quantity
                        }
                    } else {
                        const index=userCart.cart.findIndex(item=> item.productId===cartItem.productId)
                        if (index !== -1) {
                            // userCart.cart.splice(index, 1);
                            areSomeOutOfStock=true
                            return null
                        }
                    }
                }
            ).filter(cartItem => cartItem !== null)
            await userCart.save()
            res.status(200).json({
                error:false,
                message:'Cart successfully fetched',
                cart: cartWithoutId,
                areSomeOutOfStock:areSomeOutOfStock
            })
        }
        else{
            userCart= new Cart({
                userId: userId,
                cart: []
            })
            await userCart.save()
            res.status(200).json({
                error:false,
                message:'Cart successfully fetched',
                cart: []
            })
        }
    }catch (error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const mergeCart= async (req,res)=>{
    try {
        const logoutCart=req.body.cart
        const userId=req.body.userId
        let userCart=await Cart.findOne({userId: userId})
        if(!userCart){
            userCart=new Cart({
                userId,
                cart:[]
            })
        }
        if(logoutCart){
            logoutCart.forEach(
                (cartItem)=>{
                    const existingProductIndex = userCart.cart.findIndex(item => item.productId===cartItem.product.productId);
                    if(existingProductIndex !== -1){
                        const currentQuantity=userCart.cart[existingProductIndex].quantity
                        if(currentQuantity<cartItem.quantity){
                            userCart.cart[existingProductIndex].quantity=cartItem.quantity
                        }
                    }
                    else{
                        userCart.cart.push({
                            productId: cartItem.product.productId,
                            quantity: cartItem.quantity
                        });
                    }
                }
            )
        }
        await userCart.save();
        res.status(201).json({ error:false, message: 'Cart Merged Successfully' })
    } catch (error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const addToCart=async (req,res)=>{
    try{
        const {quantityToAdd}=req.query
        let quantityInt = parseInt(quantityToAdd);
        const existingProduct = await Product.findOne({ productId: req.body.productId });
        const product=existingProduct.toObject()
        const productId= product.productId
        const maxQuantity=product.quantity

        const user = await User.findById(req.user._id);
        const userId = user.toObject().userId;
        let userCart=await Cart.findOne({userId: userId})
        let updatedQuantity=0

        if (maxQuantity === 0) {
            const cartItem = await Cart.findOne({ userId: userId, 'cart.productId': productId });

            if (!cartItem) {
                return res.status(400).json({
                    error: true,
                    message: 'Product out of stock'
                });
            }

            await Cart.findOneAndUpdate(
                { userId: userId },
                { $pull: { cart: { 'productId': productId } } },
                { new: true }
            );

            return res.status(400).json({
                error: true,
                message: 'Product out of stock'
            });
        }

        if(userCart){
            const existingProductIndex = userCart.cart.findIndex(item => item.productId===productId);

            if (existingProductIndex !== -1) {
                const existingProductQuantity=userCart.cart[existingProductIndex].quantity
                if(!isNaN(quantityInt)){
                    if(quantityInt===-1){
                        userCart.cart[existingProductIndex].quantity-=1;
                        updatedQuantity=userCart.cart[existingProductIndex].quantity
                        if(userCart.cart[existingProductIndex].quantity<=0){
                            userCart.cart.splice(existingProductIndex,1)
                            updatedQuantity=0
                        }
                    }
                    else{
                        if(quantityToAdd<maxQuantity){
                            userCart.cart[existingProductIndex].quantity=quantityToAdd
                            updatedQuantity=userCart.cart[existingProductIndex].quantity
                        }
                        else{
                            userCart.cart[existingProductIndex].quantity=maxQuantity
                            updatedQuantity=userCart.cart[existingProductIndex].quantity
                        }
                    }
                }
                else{
                    if(existingProductQuantity<maxQuantity){
                        userCart.cart[existingProductIndex].quantity+=1;
                        updatedQuantity=userCart.cart[existingProductIndex].quantity
                    }
                    else{
                        console.log(existingProductQuantity)
                        userCart.cart[existingProductIndex].quantity=maxQuantity
                        await userCart.save()
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
                if(!isNaN(quantityInt)){
                    if(quantityToAdd<maxQuantity){
                        userCart.cart.push({
                            productId: productId,
                            quantity: quantityToAdd
                        });
                        updatedQuantity=quantityToAdd
                    }
                    else{
                        userCart.cart.push({
                            productId: productId,
                            quantity: maxQuantity
                        });
                        updatedQuantity=maxQuantity
                    }
                }
                else{
                    userCart.cart.push({
                        productId: productId,
                        quantity: 1
                    });
                    updatedQuantity=1
                }
            }
        }
        else{
            userCart= new Cart({
                userId: userId,
                cart:[{
                    productId: productId,
                    quantity: 1
                }]
            })
        }

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
        const userId = user.toObject().userId;

        await Cart.findOneAndUpdate(
            { userId: userId },
            { $pull: { cart: { 'productId': productId } } },
            { new: true }
        );
        res.status(201).json({message:'Product removed successfully'})
    } catch (error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const clearCart=async (req,res)=>{
    try{
        const user = await User.findById(req.user._id);
        const userId = user.toObject().userId;
        await Cart.deleteOne({userId: userId})
        res.status(201).json({message:'Cart cleared successfully'})
    } catch (error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports={
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    mergeCart
}