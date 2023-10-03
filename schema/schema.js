// mongoose models
import Client from '../server/model/Client.js'
import Project from '../server/model/Project.js'


import {GraphQLObjectType, GraphQLNonNull, GraphQLID,GraphQLString, GraphQLSchema, GraphQLList, GraphQLEnumType } from 'graphql'

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
                return Client.findById(parent.clientId)
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
// Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        // get all project
        projects:{
            type: new GraphQLList(projectType),
            resolve(parent,args){
               return Project.find()
            }
        },
        // get single project
        project:{
            type: projectType,
            args:{id:{type: GraphQLID}},
            resolve(parent,args){
                return Project.findById(args.id);
            }
        },
        // get all client
        clients:{
            type: new GraphQLList(ClientsTypes),
            resolve(parent, args){
               return Client.find()
            }
        },
        // get single client
        client:{
            type: ClientsTypes,
            args:{id:{type: GraphQLID}},
            resolve(parent, args){
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
                Project.deleteMany({ clientId: args.id })
                .then(() => {
                  return 'Projects removed successfully';
                })
                .catch((error) => {
                  throw new Error(`Error removing projects: ${error.message}`);
                });
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
                status: {
                    type: new GraphQLEnumType({
                        name: 'projectStatus',
                        values:{
                            'new':{value: 'Not Started'},
                            'progress':{value: 'In Progress'},
                            'completed':{value: 'Completed'},
                        }
                    }),
                    defaultValue: 'Not Started'
                }
            },
            resolve(_,args){
                const {name, description, clientId, status} = args
                const project =  Project.create({name, description, clientId, status})
                return Project
            }
        },
        // delete project
        deleteProject:{
            type: projectType,
            args:{
                id:{type: GraphQLNonNull(GraphQLID)}
            },
            resolve(_,args){
                return Project.findByIdAndDelete(args.id)
            }
        },
        // update projject
        updateProject:{
            type: projectType,
            args:{
                id:{type: GraphQLNonNull(GraphQLID)},
                name:{type: GraphQLString},
                description: {type: GraphQLString},
                status: {
                    type: new GraphQLEnumType({
                        name: 'projectStatusUpdate',
                        values:{
                            'new':{value: 'Not Started'},
                            'progress':{value: 'In Progress'},
                            'completed':{value: 'Completed'},
                        }
                    }),
                    defaultValue: 'Not Started'
                }
            },
            resolve(_,args){
                const {name, description, status} = args
                return Project.findByIdAndUpdate(
                    args.id,
                    {name, description, status},
                    {new:true}
                )
            }
        }

    }
})
export default new GraphQLSchema({
    query:RootQuery,
    mutation:myMutation
})