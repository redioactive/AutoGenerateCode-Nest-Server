export class ErrorCode {
  static readonly SUCCESS = new ErrorCode(0, 'ok');
  static readonly PARAMS_ERROR = new ErrorCode(40000, '请求参数错误');
  static readonly NOT_LOGIN_ERROR = new ErrorCode(40100, '未登录');
  static readonly NO_AUTH_ERROR = new ErrorCode(40101, '无权限');
  static readonly NOT_FOUND_ERROR = new ErrorCode(40400, '请求数据不存在');
  static readonly FORBIDDEN_ERROR = new ErrorCode(40300, '禁止访问');
  static readonly SYSTEM_ERROR = new ErrorCode(50000, '系统内部异常');
  static readonly OPERATION_ERROR = new ErrorCode(50001, '操作失败');

  private constructor(public readonly code: number, public readonly message: string) {}

  // 用于根据 code 找到对应的 ErrorCode 实例
  static fromCode(code: number): ErrorCode | undefined {
    return Object.values(ErrorCode).find((error) => error instanceof ErrorCode && error.code === code);
  }
}
