import axios, { AxiosInstance } from 'axios'
export interface IHttpService extends AxiosInstance {
  isReAuthenticating?: boolean
  pendingRequests?: any[]
}

export const HttpService: IHttpService = axios.create()
