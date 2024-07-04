import {
  GetTodoTaskSortBy,
  GetTodoTaskSortOrder,
} from '@/network/protos/netMessage';

export type Filter = {
  startDueDate: Date | null;
  endDueDate: Date | null;
  status: Status[];
};

export enum SortBy {
  Name,
  DueDate,
  Status,
}

export function toSortByProto(sortBy: SortBy) {
  switch (sortBy) {
    case SortBy.Name:
      return GetTodoTaskSortBy.GetTodoTaskSortBy_ByName;
    case SortBy.DueDate:
      return GetTodoTaskSortBy.GetTodoTaskSortBy_ByDueDate;
    case SortBy.Status:
      return GetTodoTaskSortBy.GetTodoTaskSortBy_ByStatus;
  }
}

export enum SortOrder {
  ASC,
  DESC,
}

export function toSortOrderProto(sortOrder: SortOrder) {
  switch (sortOrder) {
    case SortOrder.ASC:
      return GetTodoTaskSortOrder.GetTodoTaskSortOrder_ASC;
    case SortOrder.DESC:
      return GetTodoTaskSortOrder.GetTodoTaskSortOrder_DESC;
  }
}

export type Sort = {
  sortBy: SortBy;
  sortOrder: SortOrder;
};

export type Status = 'NotStarted' | 'InProgress' | 'Completed';

export class TodoTask {
  constructor(
    public name: string,
    public description: string,
    public dueDate: Date,
    public status: Status,
    public id?: number,
  ) {}

  matchesFilter(filter: Filter) {
    if (filter.startDueDate && filter.startDueDate > this.dueDate) {
      return false;
    }
    if (filter.endDueDate && filter.endDueDate < this.dueDate) {
      return false;
    }
    if (this.status! in filter.status) {
      return false;
    }

    return true;
  }
}
