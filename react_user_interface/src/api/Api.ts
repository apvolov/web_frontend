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

export interface DsPrincipality {
  description?: string;
  id?: number;
  image?: string;
  is_delete?: boolean;
  name?: string;
  year0?: string;
  year1?: string;
}

export interface HandlerEditAreaInput {
  /** @example 1200.5 */
  area?: number;
}

export interface HandlerEditPopulationInput {
  /** @example "Иван Иванов" */
  researcher_name?: string;
}

export interface HandlerFinishPopulationInput {
  /** @example "finished" */
  status?: string;
}

export interface HandlerLoginResponse {
  /** @example "успешный вход" */
  message?: string;
  user?: SerializerUserJSON;
}

export interface HandlerResponseError {
  /** @example "описание ошибки" */
  error?: string;
}

export interface SerializerPrincipalityJSON {
  description?: string;
  image_url?: string;
  name?: string;
  year0?: string;
  year1?: string;
}

export interface SerializerUserJSON {
  login?: string;
  password?: string;
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
 * @title No title
 * @contact
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Удаляет связь между конкретной заявкой и конкретным княжеством.
     *
     * @tags population-principalities
     * @name PopulationPrincipalitiesDeletePrincipalityDelete
     * @summary Удалить княжество из заявки
     * @request DELETE:/api/population-principalities/{population_id}/{principality_id}/delete_principality
     */
    populationPrincipalitiesDeletePrincipalityDelete: (
      populationId: number,
      principalityId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HandlerResponseError>({
        path: `/api/population-principalities/${populationId}/${principalityId}/delete_principality`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Обновляет площадь (area) для конкретного княжества в рамках конкретной заявки.
     *
     * @tags population-principalities
     * @name PopulationPrincipalitiesEditUpdate
     * @summary Изменить параметры княжества в заявке
     * @request PUT:/api/population-principalities/{population_id}/{principality_id}/edit
     */
    populationPrincipalitiesEditUpdate: (
      populationId: number,
      principalityId: number,
      body: HandlerEditAreaInput,
      params: RequestParams = {},
    ) =>
      this.request<void, HandlerResponseError>({
        path: `/api/population-principalities/${populationId}/${principalityId}/edit`,
        method: "PUT",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Возвращает список всех заявок с фильтрацией по статусу и временному интервалу. Включает логины пользователя/админа и количество княжеств с рассчитанной популяцией.
     *
     * @tags populations
     * @name PopulationsList
     * @summary Получить список заявок
     * @request GET:/api/populations
     */
    populationsList: (
      query?: {
        /** Фильтр по статусу: 'deleted', 'draft', 'form', 'finished', 'rejected' */
        status?: string;
        /** Дата начала интервала (ISO8601, например: 2024-01-01T00:00:00Z) */
        from?: string;
        /** Дата конца интервала (ISO8601) */
        to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>[], HandlerResponseError>({
        path: `/api/populations`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Ищет активную сессию через куку session_id и возвращает черновик пользователя.
     *
     * @tags populations
     * @name PopulationsDraftList
     * @summary Получить текущую заявку
     * @request GET:/api/populations/draft
     */
    populationsDraftList: (params: RequestParams = {}) =>
      this.request<Record<string, any>, HandlerResponseError>({
        path: `/api/populations/draft`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает одну заявку и список привязанных к ней княжеств.
     *
     * @tags populations
     * @name PopulationsDetail
     * @summary Получить детали заявки
     * @request GET:/api/populations/{id}
     */
    populationsDetail: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, HandlerResponseError>({
        path: `/api/populations/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Мягкое удаление заявки (перевод в статус deleted).
     *
     * @tags populations
     * @name PopulationsDeleteDelete
     * @summary Удалить заявку
     * @request DELETE:/api/populations/{id}/delete
     */
    populationsDeleteDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, HandlerResponseError>({
        path: `/api/populations/${id}/delete`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Изменяет имя исследователя в заявке.
     *
     * @tags populations
     * @name PopulationsEditUpdate
     * @summary Редактировать заявку
     * @request PUT:/api/populations/{id}/edit
     */
    populationsEditUpdate: (
      id: number,
      body: HandlerEditPopulationInput,
      params: RequestParams = {},
    ) =>
      this.request<void, HandlerResponseError>({
        path: `/api/populations/${id}/edit`,
        method: "PUT",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Действие доступно только модератору. Устанавливает финальный статус.
     *
     * @tags populations
     * @name PopulationsFinishUpdate
     * @summary Завершить/отклонить заявку
     * @request PUT:/api/populations/{id}/finish
     */
    populationsFinishUpdate: (
      id: number,
      body: HandlerFinishPopulationInput,
      params: RequestParams = {},
    ) =>
      this.request<void, HandlerResponseError>({
        path: `/api/populations/${id}/finish`,
        method: "PUT",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Переводит заявку из черновика в статус формирования (отправка модератору).
     *
     * @tags populations
     * @name PopulationsFormUpdate
     * @summary Сформировать заявку
     * @request PUT:/api/populations/{id}/form
     */
    populationsFormUpdate: (id: number, params: RequestParams = {}) =>
      this.request<void, HandlerResponseError>({
        path: `/api/populations/${id}/form`,
        method: "PUT",
        ...params,
      }),

    /**
     * @description Возвращает список всех княжеств, которые не помечены как удаленные. Поддерживает фильтрацию по названию.
     *
     * @tags principalities
     * @name PrincipalitiesList
     * @summary Получить список княжеств
     * @request GET:/api/principalities
     */
    principalitiesList: (
      query?: {
        /** Фильтр по названию княжества (частичное совпадение) */
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsPrincipality[], HandlerResponseError>({
        path: `/api/principalities`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет новую запись о княжестве в базу данных. Поле Image инициализируется пустым, IsDelete устанавливается в false.
     *
     * @tags principalities
     * @name PrincipalitiesCreateCreate
     * @summary Создать новое княжество
     * @request POST:/api/principalities/create
     */
    principalitiesCreateCreate: (
      input: SerializerPrincipalityJSON,
      params: RequestParams = {},
    ) =>
      this.request<DsPrincipality, HandlerResponseError>({
        path: `/api/principalities/create`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает данные одного княжества по его ID. Если княжество помечено как удаленное или не существует, возвращает 404.
     *
     * @tags principalities
     * @name PrincipalitiesDetail
     * @summary Получить детальную информацию о княжестве
     * @request GET:/api/principalities/{id}
     */
    principalitiesDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsPrincipality, HandlerResponseError>({
        path: `/api/principalities/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Находит текущую заявку (Population) и создает связь с указанным княжеством.
     *
     * @tags principalities
     * @name PrincipalitiesAddToDraftPopulationCreate
     * @summary Добавить княжество в текущую заявку
     * @request POST:/api/principalities/{id}/add-to-draft-population
     */
    principalitiesAddToDraftPopulationCreate: (
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, HandlerResponseError>({
        path: `/api/principalities/${id}/add-to-draft-population`,
        method: "POST",
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Выполняет мягкое удаление записи (is_delete = true) и полностью удаляет связанное изображение из хранилища MinIO.
     *
     * @tags principalities
     * @name PrincipalitiesDeleteDelete
     * @summary Удалить княжество
     * @request DELETE:/api/principalities/{id}/delete
     */
    principalitiesDeleteDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, HandlerResponseError>({
        path: `/api/principalities/${id}/delete`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Обновляет данные существующего княжества по его ID. Обновляются только те поля, которые переданы в JSON.
     *
     * @tags principalities
     * @name PrincipalitiesEditUpdate
     * @summary Редактировать княжество
     * @request PUT:/api/principalities/{id}/edit
     */
    principalitiesEditUpdate: (
      id: number,
      input: SerializerPrincipalityJSON,
      params: RequestParams = {},
    ) =>
      this.request<DsPrincipality, HandlerResponseError>({
        path: `/api/principalities/${id}/edit`,
        method: "PUT",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Принимает файл изображения, генерирует уникальное имя через UUID, сохраняет его в MinIO и обновляет ссылку в БД.
     *
     * @tags principalities
     * @name PrincipalitiesImageCreate
     * @summary Загрузить изображение для княжества
     * @request POST:/api/principalities/{id}/image
     */
    principalitiesImageCreate: (
      id: number,
      data: {
        /** Файл изображения (jpg/png) */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, HandlerResponseError>({
        path: `/api/principalities/${id}/image`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Аутентификация и создание сессии в Redis
     *
     * @tags users
     * @name UsersLoginCreate
     * @summary Вход
     * @request POST:/api/users/login
     */
    usersLoginCreate: (input: SerializerUserJSON, params: RequestParams = {}) =>
      this.request<HandlerLoginResponse, HandlerResponseError>({
        path: `/api/users/login`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаление сессии из Redis и очистка куки
     *
     * @tags users
     * @name UsersLogoutCreate
     * @summary Выход
     * @request POST:/api/users/logout
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, string>, HandlerResponseError>({
        path: `/api/users/logout`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description Получение данных текущего пользователя из сессии
     *
     * @tags users
     * @name UsersMeList
     * @summary Личный кабинет
     * @request GET:/api/users/me
     */
    usersMeList: (params: RequestParams = {}) =>
      this.request<SerializerUserJSON, HandlerResponseError>({
        path: `/api/users/me`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет данные текущего пользователя
     *
     * @tags users
     * @name UsersMeUpdate
     * @summary Редактирование профиля
     * @request PUT:/api/users/me
     */
    usersMeUpdate: (input: SerializerUserJSON, params: RequestParams = {}) =>
      this.request<SerializerUserJSON, HandlerResponseError>({
        path: `/api/users/me`,
        method: "PUT",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает нового пользователя
     *
     * @tags users
     * @name UsersRegisterCreate
     * @summary Регистрация
     * @request POST:/api/users/register
     */
    usersRegisterCreate: (
      input: SerializerUserJSON,
      params: RequestParams = {},
    ) =>
      this.request<SerializerUserJSON, HandlerResponseError>({
        path: `/api/users/register`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
