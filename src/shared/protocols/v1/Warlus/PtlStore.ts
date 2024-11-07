// This is a demo code file
// Feel free to delete it

/**
 * 增加数据
 * 此处的注释将会自动附带到生成的 API 文档中
 */
export interface ReqStore {
    /** 要增加的消息内容 */
    da_height: string
    blob:string
    epochs: number
}

export interface ResStore {
    /** 服务端内容创建时间 */
    sui_digest:string
    time: string
}
