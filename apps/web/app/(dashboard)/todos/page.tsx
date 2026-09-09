import Todo from "./_components/Todo";
import { todoService } from "@/lib/services/todo.service";
import { todoQuerySchema } from "@/schema/todo";
import { getOptionalSession } from "@/lib/auth/session";

const TodosPage = async ({ searchParams }: PageProps<"/todos">) => {
  const session = await getOptionalSession();
  const params = await searchParams;

  const query = todoQuerySchema.parse({
    search: typeof params.search === "string" ? params.search : undefined,
    status: typeof params.status === "string" ? params.status : undefined,
  });

  const initialTodos = session
    ? await todoService.listForUser(session.user.id, query)
    : [];

  return (
    <main>
      <h1>My Todos</h1>
      <p>Welcome to your todos page!</p>
      <Todo
        key={`${query.search ?? ""}:${query.status}`}
        initialTodos={initialTodos}
      />
    </main>
  );
};

export default TodosPage;
