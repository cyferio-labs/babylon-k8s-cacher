// This is a demo code file
// Feel free to delete it

/**
 * 增加数据
 * 此处的注释将会自动附带到生成的 API 文档中
 */
export interface ReqDaManager {
    /** 要增加的消息内容 */
    da_height:string
    blob:string
}

export interface ResDaManager {
    /** 服务端内容创建时间 */
    babylon_digest: string
    time: Date
}
