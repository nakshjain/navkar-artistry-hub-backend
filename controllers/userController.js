const User = require("../model/userSchema");
const ObjectId = require('mongoose').Types.ObjectId;

const getUserDetails= async (req, res)=>{
    await User.findById(req.user._id).then((user)=>{
        if(!user){return res.status((404)).end()}
        const{_id,password,__v,...userWithoutId}=user.toObject()
        res.status(200).json(userWithoutId)
    })
}

const addAddress=async(req,res)=>{
    try{
        const address=req.body.address
        const user= await User.findById(req.user._id)
        user.addresses.push(address)
        await user.save()
        res.status(201).json({error:false, message:"Address added successfully"})
    }catch (error){
        console.error(error);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
}

const updateAddress=async(req,res)=>{
    try{
        const {address, updateAddressId}=req.body
        const user= await User.findById(req.user._id)
        const addressObjectId=new ObjectId(updateAddressId)
        const existingAddressIndex=user.addresses.findIndex((address)=>address._id.equals(addressObjectId))
        if(existingAddressIndex!==-1){
            user.addresses[existingAddressIndex]=address
        }
        await user.save()
        res.status(201).json({error:false, message:"Address updated successfully"})
    }catch (error){
        console.error(error);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
}

const removeAddress= async (req,res)=>{
    try{
        const {addressId}=req.query
        const user= await User.findById(req.user._id)
        const addressObjectId=new ObjectId(addressId)
        const existingAddressIndex=user.addresses.findIndex((address)=>address._id.equals(addressObjectId))
        if(existingAddressIndex!==-1){
            user.addresses.splice(existingAddressIndex,1)
        }
        await user.save()
        res.status(201).json({error:false, message:"Address removed successfully"})
    }catch (error){
        console.error(error);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
}

const setDefaultAddress= async (req, res)=>{
    try{
        const {addressId}=req.body
        const user= await User.findById(req.user._id)
        user.defaultAddress=addressId
        await user.save()
        res.status(201).json({error:false, message:"Default address updated successfully"})
    } catch (error){
        console.error(error);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
}

module.exports={
    getUserDetails,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress
}