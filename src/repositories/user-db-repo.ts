import {ObjectId} from "mongodb";
import { userCollection} from "./db";
import {userAccountDbType, userDBType, userType} from "../types";

export const userRepo = {
    async createUser(user:any):Promise<any>{
        await userCollection.insertOne(user)
            //@ts-ignore
        delete Object.assign(user, {["id"]: user["_id"] })["_id"];
        return user;
},
    async findByLoginOrEmail(loginOrEmail:string){
        const user = await userCollection.findOne({$or:[{"email":loginOrEmail},{"login":loginOrEmail}]})
        //@ts-ignore
        //delete Object.assign(user, {["id"]: user["_id"] })["_id"];
        return user

    },
    async findByLogin(login:string){
        const user = await userCollection.findOne({login:login}/*{$or:[{"email":loginOrEmail},{"userName":loginOrEmail}]}*/)
        if(user){
            // @ts-ignore
            delete Object.assign(user, {["id"]: user["_id"] })["_id"];
        }
        return user;
},
    async findById(id:string){
        const user = await userCollection.find({_id: new ObjectId(id)}).toArray()
        console.log("Repo")
        if(user[0]){
            // @ts-ignore
            delete Object.assign(user[0], {["userId"]: user[0]["_id"] })["_id"];
        }
        return {
            id: user[0].id,
            login: user[0].login,
            email: user[0].email,
            createdAt: user[0].createdAt
    }//user[0];
    },
    async deleteUser(id:string){
        const result = await userCollection.deleteOne({_id:new ObjectId(id)})
        return result.deletedCount === 1
    },

    async getUsers(searchLoginTerm:string, searchEmailTerm:string, pageNumber:number,pageSize:number, sortBy:string, sortDirection:any){
        const users = await userCollection.find({$or:[{"login":{$regex:searchLoginTerm, $options : 'i' }},{"email":{$regex: searchEmailTerm,$options : 'i' }}]})
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .sort( {[sortBy] : sortDirection} )
            .toArray();

        const temp = users.map((user) => {
            //@ts-ignore
            delete Object.assign(user, {["id"]: user["_id"] })["_id"];
            delete user.passwordHash;
            delete user.passwordSalt;
            return user
        })

        const totalCount = await userCollection.count({$or:[{"login":{$regex:searchLoginTerm, $options : 'i' }},{"email":{$regex: searchEmailTerm,$options : 'i' }}]});

        const outputObj = {
            pagesCount:Math.ceil(totalCount/pageSize),
            page:pageNumber,
            pageSize:pageSize,
            totalCount:totalCount,
            items:temp
        }
        return outputObj
    },
    async deleteAll():Promise<boolean>{
        const result = await userCollection.deleteMany({})
        return result.deletedCount === 1
    },

    async updateConfirmation(id:string){
        const result = await userCollection.updateOne({_id:new ObjectId(id)}, {$set:{"emailConfirmation.isConfirmed":true}})
        return result.modifiedCount === 1
    },

    async updateConfirmationCode(id:string, code:string){
        const result = await userCollection.updateOne({_id:new ObjectId(id)}, {$set:{"emailConfirmation.confirmationCode":code}})
        return result.modifiedCount === 1
    },

    async getUserByCode(code:string):Promise<any>{
        const user = await userCollection.findOne({"emailConfirmation.confirmationCode":code})
        if(user){
            //@ts-ignore
            delete Object.assign(user, {["id"]: user["_id"] })["_id"];
        }

        return user
    },
    async getByEmail(email:string){
        const user = await userCollection.findOne({email:email})
        if(user){
            //@ts-ignore
            delete Object.assign(user, {["id"]: user["_id"] })["_id"];
        }

        return user;
    },

}