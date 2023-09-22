// mongoose models
import Client from '../server/model/Client.js'
import Project from '../server/model/Project.js'


import {GraphQLObjectType, GraphQlEnumType, GraphQLNonNull, GraphQLID,GraphQLString, GraphQLSchema, GraphQLList } from 'graphql'

// skeleton
const projectType = new GraphQLObjectType({
    name:'project',
    fields:()=>({
        id: {type: GraphQLID},
        clientId: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        status: {type: GraphQLString},
        client:{
            type:ClientsTypes,
            resolve(parent,arg){
                // return clients.find((client)=> client.id === parent.id)
                return Client.find({_id: parent.id})
            }
        }

    })
})
// skeleton
const ClientsTypes = new GraphQLObjectType({
    name: "Client",
    fields:()=>({
        id:{type: GraphQLID },
        name:{type: GraphQLString},
        email:{type: GraphQLString},
        phone:{type: GraphQLString},
    })
});
// QUery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        projects:{
            type: new GraphQLList(projectType),
            resolve(parent,args){
               return Project.find()
            }
        },
        project:{
            type: projectType,
            args:{id:{type: GraphQLID}},
            resolve(parent,args){
                // return projects.find((project)=> project.id === args.id)
                return Project.findById(args.id);
            }
        },
        clients:{
            type: new GraphQLList(ClientsTypes),
            resolve(parent, args){
               return Client.find()
            }
        },
        client:{
            type: ClientsTypes,
            args:{id:{type: GraphQLID}},
            resolve(parent, args){
                // return clients.find((client)=> client.id === args.id)
                return Client.findById(args.id)
            }
        }
    }
})
// mutation
const myMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        //  add client side
        addClient:{
            type: ClientsTypes,
            args: {
                name:{type: GraphQLNonNull(GraphQLString)},
                email:{type: GraphQLNonNull(GraphQLString)},
                phone:{type: GraphQLNonNull(GraphQLString)},
            },
            resolve(_, args){
                const {name, email, phone} = args
                const clients = Client.create({name,email,phone})
                return clients
            }
        },
        // delete client
        deleteClient:{
            type: ClientsTypes,
            args:{id:{type: GraphQLNonNull(GraphQLID)}}, 
            resolve(_, args){
                return Client.findByIdAndDelete(args.id)
            }
        },
        // add project
        addProject:{
            type: projectType,
            args: {
                name:{type: GraphQLNonNull(GraphQLString)},
                description:{type:GraphQLNonNull(GraphQLString)},
                clientId:{type:GraphQLNonNull(GraphQLID)},
                status: new GraphQlEnumType({
                    name: 'projectStatus',
                    values:{
                        'new':{value: 'Not Started'},
                        'progress':{value: 'In Progress'},
                        'completed':{value: 'Completed'},
                    }
                }),
                defaultValue: 'Not Started'
            },
            resolve(_,args){
                const {name, description, clientId, status} = args
                const project =  Project.create({name, description, clientId, status})
                return project
            }
        }

    }
})
export default new GraphQLSchema({
    query:RootQuery,
    mutation:myMutation
})