/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BiochemicalIndicatorResponseDto {
  /** @example 1 */
  indicatorId: object | null;
  /** @example "Лимфоциты" */
  title: string;
  /** @example "Описание показателя" */
  description: string;
  /** @example 3.5 */
  lowerReferenceLimit: number;
  /** @example 6.1 */
  upperReferenceLimit: number;
  /** @example "http://minio/.../img.png" */
  imageUrl: string;
  /** @example "http://minio/.../vid.mp4" */
  videoUrl: string;
  /** @example 10 */
  creatorId: object;
  /** @example "2024-01-01T00:00:00.000Z" */
  createdAt: object;
  /** @example "2024-01-02T00:00:00.000Z" */
  formedAt: object | null;
  /**
   * 1, если текущий пользователь — автор
   * @example 1
   */
  isOwner: number;
  /**
   * 1, если текущий пользователь лайкнул
   * @example 1
   */
  isLiked: number;
  /** @example 5 */
  likesCount: number;
}

export interface PublishBiochemicalIndicatorDto {
  /** @example "Описание" */
  description: string;
  /** @example "3.5" */
  lowerReferenceLimit: number;
  /** @example "6.1" */
  upperReferenceLimit: number;
}

export interface LikeBiochemicalIndicatorDto {
  /**
   * 1 — поставить лайк, 0 — убрать
   * @example 1
   */
  like: number;
}

export interface RegisterDto {
  /**
   * Логин пользователя
   * @example "alice"
   */
  login: string;
  /**
   * Пароль
   * @example "1234"
   */
  passwordHash: string;
}

export interface LoginDto {
  /**
   * Логин пользователя
   * @example "alice"
   */
  login: string;
  /**
   * Пароль
   * @example "1234"
   */
  passwordHash: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Biochemical Indicators API
 * @version 1.0
 * @contact
 *
 * API для лабораторной работы 4
 */
export class BiochemicalIndicatorApi<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Biochemical Indicators
     * @name GetBiochemicalIndicators
     * @summary Получить список показателей
     * @request GET:/api/biochemical-indicators
     */
    getBiochemicalIndicators: (
      query?: {
        /** @example "5" */
        indicatorConcentration?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BiochemicalIndicatorResponseDto[], any>({
        path: `/api/biochemical-indicators`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Biochemical Indicators
     * @name GetBiochemicalIndicatorFeed
     * @summary Получить ленту показателей
     * @request GET:/api/biochemical-indicators/feed
     */
    getBiochemicalIndicatorFeed: (
      query?: {
        /** @example "10" */
        indicatorId?: number;
        /** @example "true" */
        next?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BiochemicalIndicatorResponseDto, any>({
        path: `/api/biochemical-indicators/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Biochemical Indicators
     * @name GetBiochemicalIndicatorDraft
     * @summary Получить черновик показателя
     * @request GET:/api/biochemical-indicators/draft
     * @secure
     */
    getBiochemicalIndicatorDraft: (params: RequestParams = {}) =>
      this.request<BiochemicalIndicatorResponseDto, any>({
        path: `/api/biochemical-indicators/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Biochemical Indicators
     * @name CreateBiochemicalIndicatorDraft
     * @summary Создать или обновить черновик показателя
     * @request POST:/api/biochemical-indicators/draft
     * @secure
     */
    createBiochemicalIndicatorDraft: (
      data: {
        /** @example "Лимфоциты" */
        title?: string;
        /** @format binary */
        image?: File;
        /** @format binary */
        video?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/biochemical-indicators/draft`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Biochemical Indicators
     * @name PublishBiochemicalIndicator
     * @summary Опубликовать показатель
     * @request PUT:/api/biochemical-indicators/draft/publish
     * @secure
     */
    publishBiochemicalIndicator: (
      data: PublishBiochemicalIndicatorDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/biochemical-indicators/draft/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Biochemical Indicators
     * @name DeleteBiochemicalIndicator
     * @summary Удалить показатель
     * @request DELETE:/api/biochemical-indicators/{id}
     * @secure
     */
    deleteBiochemicalIndicator: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/biochemical-indicators/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Biochemical Indicators
     * @name LikeBiochemicalIndicator
     * @summary Поставить/убрать лайк
     * @request POST:/api/biochemical-indicators/{id}/like
     * @secure
     */
    likeBiochemicalIndicator: (
      id: number,
      data: LikeBiochemicalIndicatorDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/biochemical-indicators/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerRegisterUser
     * @summary Зарегистрировать нового пользователя
     * @request POST:/api/auth/register
     */
    authControllerRegisterUser: (
      data: RegisterDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLogin
     * @summary Войти в систему
     * @request POST:/api/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLogout
     * @summary Выйти из системы
     * @request POST:/api/auth/logout
     */
    authControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/logout`,
        method: "POST",
        ...params,
      }),
  };
}
