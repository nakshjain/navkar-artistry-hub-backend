const User = require("../model/userSchema");
const ObjectId = require('mongoose').Types.ObjectId;

const getUserDetails= async (req, res)=>{
    await User.findById(req.user._id).then((user)=>{
        if(!user){return res.status((404)).end()}
        const{_id,password,__v,...userWithoutId}=user.toObject()
        res.status(200).json(userWithoutId)
    })
}
 const updateUserDetails= async (req, res)=>{
    try {
        const {userDetails}=req.body
        const name = userDetails.Name;
        const email = userDetails.Email;
        const phoneNumber = userDetails['Phone Number'];
        const dob = userDetails['Date of Birth'];
        console.log(dob)

        const existingUserDetails= await User.findById(req.user._id)
        if(existingUserDetails){
            existingUserDetails.name=name
            existingUserDetails.email=email
            existingUserDetails.contactNumber=phoneNumber
            existingUserDetails.dob=dob
        }
        await existingUserDetails.save()
        res.status(200).json({error: false, message:'User details updated successfully', userDetails: existingUserDetails})
    } catch (error){
        console.error(error);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
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
    updateUserDetails,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress
}