import {Request, Response} from 'express';
import {handleError} from '../helpers/error';
import {SystemInfoType} from '../types';
import SystemInfo from '../model/systemInfo';

const getSystemInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const systemInfo: SystemInfoType | null = await SystemInfo.findOne();
    res.status(200).json(systemInfo);
  } catch (err) {
    res.status(500).json({error: handleError(err)});
  }
};

export default {getSystemInfo};
