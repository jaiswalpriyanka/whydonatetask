export const environment = {
  production: true
};

export interface Environment
{
	apiURL:string;
	imageurl:string;
}

export const PROD: Environment = {
      apiURL:'http://localhost:3208/api/',
      imageurl:'http://localhost:3208/assets/images/',


    }

export const environmenturl: Environment = PROD;
