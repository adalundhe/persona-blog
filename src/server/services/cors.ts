import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from "next";


const corsSettings = Cors({
  methods: ['GET', 'HEAD', 'OPTIONS', 'POST'],
  origin: '*'
})


const executeCors = function(req: NextApiRequest, res: NextApiResponse, fn: any) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result)
        }
  
        return resolve(result)
      })
    })
  }


  export const corsMiddleware = {
      settings: corsSettings,
      executeCors: executeCors
  }