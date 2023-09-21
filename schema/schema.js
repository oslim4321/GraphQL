import {projects, clients} from '../sampleData.js'
// mongoose models
import Client from '../server/model/Client.js'
import Project from '../server/model/Project.js'


import {GraphQLObjectType, GraphQLID,GraphQLString, GraphQLSchema, GraphQLList} from 'graphql'

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
export default new GraphQLSchema({
    query:RootQuery
})