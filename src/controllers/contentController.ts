import { Request, Response } from 'express';
import { ContentModel, IContent} from '../models/Content';
import { ContentSchema, ContentInput } from '../utils/validation';

export const createContent = async (req : Request,res : Response) : Promise<any> => {
    try{
      const parsedInput : ContentInput = ContentSchema.parse(req.body);
      
      const content : IContent = await ContentModel.create({
        title: parsedInput.title,
        link: parsedInput.link,
        tags: [],
        userId: req.userId
      });
  
      return res.status(201).json({
        message: "Content successfully created"
      });
    }
    catch(err){
      res.status(400).json({
        message: "Failed to create content"
      })
    }
}
  
export const getContent = async (req : Request,res : Response) : Promise<any> => {
    const userId = req.userId;
    const content = await ContentModel.find({
      userId: userId
    }).populate('userId', "username");

    return res.status(200).json({
      content: content
    });
}
  
export const deleteContent = async (req : Request,res : Response) : Promise<any> => {
    const userId = req.userId;
    const {id} = req.params;
    const content = await ContentModel.findOne({
      _id : id,
      userId: userId
    })
  
    if(content){
      await ContentModel.deleteOne({
        _id : id,
      })
  
      return res.status(200).json({
        message :"Content successfully deleted"
      })
    }
    else{
      return res.status(404).json({
        message: "Content not found"
      });
    }
}