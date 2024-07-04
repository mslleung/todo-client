import {
  Filter,
  Sort,
  Status,
  TodoTask,
  toSortByProto,
  toSortOrderProto,
} from '@/models/todoTask';
import {
  CreateTodoTaskRequestPayload,
  CreateTodoTaskResponsePayload,
  ErrorCode,
  GetTodoTaskRequestPayload,
  GetTodoTaskResponsePayload,
  MessageType,
  NetMessage,
  RequestType,
  Status as ProtoStatus,
  UpdateTodoTaskRequestPayload,
  UpdateTodoTaskResponsePayload,
  DeleteTodoTaskRequestPayload,
  DeleteTodoTaskResponsePayload,
} from '@/network/protos/netMessage';
import { send } from '@/network/websocket';
import assert from 'assert';

function toStatusProto(status: Status) {
  switch (status) {
    case 'NotStarted':
      return ProtoStatus.Status_NotStarted;
    case 'InProgress':
      return ProtoStatus.Status_InProgress;
    case 'Completed':
      return ProtoStatus.Status_Completed;
  }
}

function fromStatusProto(protoStatus: ProtoStatus): Status {
  switch (protoStatus) {
    case ProtoStatus.Status_Unspecified:
      assert(false);
    case ProtoStatus.Status_NotStarted:
      return 'NotStarted';
    case ProtoStatus.Status_InProgress:
      return 'InProgress';
    case ProtoStatus.Status_Completed:
      return 'Completed';
  }
}

export async function createTodo(
  name: string,
  description: string,
  dueDate: Date,
  status: Status,
) {
  const response = await send(
    NetMessage.create({
      header: {
        messageType: MessageType.UserInitiatedRequest,
        requestType: RequestType.CreateTodoTask,
        requestUuid: crypto.randomUUID(),
      },
      payload: {
        type: 'io.sleekflow.infrastructure.network.proto.payload.CreateTodoTaskRequestPayload',
        value: CreateTodoTaskRequestPayload.toBinary(
          CreateTodoTaskRequestPayload.create({
            name: name,
            description: description,
            dueDate: BigInt(dueDate.getTime()),
            status: toStatusProto(status),
          }),
        ),
      },
    }),
  );

  let payload = CreateTodoTaskResponsePayload.fromBinary(
    response.payload!.value,
  );
  if (payload.errorCode !== ErrorCode.ErrorCode_Success) {
    throw Error('Create TODO failed.');
  }
  return payload.id!;
}

export async function updateTodo(todoTask: TodoTask) {
  const response = await send(
    NetMessage.create({
      header: {
        messageType: MessageType.UserInitiatedRequest,
        requestType: RequestType.UpdateTodoTask,
        requestUuid: crypto.randomUUID(),
      },
      payload: {
        type: 'io.sleekflow.infrastructure.network.proto.payload.UpdateTodoTaskRequestPayload',
        value: UpdateTodoTaskRequestPayload.toBinary(
          UpdateTodoTaskRequestPayload.create({
            id: todoTask.id!,
            name: todoTask.name,
            description: todoTask.description,
            dueDate: BigInt(todoTask.dueDate.getTime()),
            status: toStatusProto(todoTask.status),
          }),
        ),
      },
    }),
  );

  let payload = UpdateTodoTaskResponsePayload.fromBinary(
    response.payload!.value,
  );
  if (payload.errorCode !== ErrorCode.ErrorCode_Success) {
    throw Error('Update TODO failed.');
  }
}

export async function deleteTodo(todoTask: TodoTask) {
  const response = await send(
    NetMessage.create({
      header: {
        messageType: MessageType.UserInitiatedRequest,
        requestType: RequestType.DeleteTodoTask,
        requestUuid: crypto.randomUUID(),
      },
      payload: {
        type: 'io.sleekflow.infrastructure.network.proto.payload.DeleteTodoTaskRequestPayload',
        value: DeleteTodoTaskRequestPayload.toBinary(
          DeleteTodoTaskRequestPayload.create({
            id: todoTask.id!,
          }),
        ),
      },
    }),
  );

  let payload = DeleteTodoTaskResponsePayload.fromBinary(
    response.payload!.value,
  );
  if (payload.errorCode !== ErrorCode.ErrorCode_Success) {
    throw Error('Delete TODO failed.');
  }
}

export async function getAllTodos(
  filter: Filter,
  sort: Sort,
): Promise<TodoTask[]> {
  const response = await send(
    NetMessage.create({
      header: {
        messageType: MessageType.UserInitiatedRequest,
        requestType: RequestType.GetTodoTask,
        requestUuid: crypto.randomUUID(),
      },
      payload: {
        type: 'io.sleekflow.infrastructure.network.proto.payload.GetTodoTaskRequestPayload',
        value: GetTodoTaskRequestPayload.toBinary(
          GetTodoTaskRequestPayload.create({
            filter: {
              dueDateRangeStart: filter.startDueDate
                ? BigInt(filter.startDueDate.getTime())
                : undefined,
              dueDateRangeEnd: filter.endDueDate
                ? BigInt(filter.endDueDate.getTime())
                : undefined,
              statusList: filter.status.map((status) => toStatusProto(status)),
            },
            sort: {
              sortBy: toSortByProto(sort.sortBy),
              sortOrder: toSortOrderProto(sort.sortOrder),
            },
          }),
        ),
      },
    }),
  );

  let payload = GetTodoTaskResponsePayload.fromBinary(response.payload!.value);
  return payload.todos.map(
    (protoTodoTask) =>
      new TodoTask(
        protoTodoTask.name!,
        protoTodoTask.description!,
        new Date(Number(protoTodoTask.dueDate!)),
        fromStatusProto(protoTodoTask.status!),
        protoTodoTask.id!,
      ),
  );
}
