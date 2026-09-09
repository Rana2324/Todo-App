import SharedTodoCard from "./_components/SharedTodoCard";
import { shareService } from "@/lib/services/share.service";

const SharedTodoPage = async ({ params }: PageProps<"/share/[token]">) => {
  const { token } = await params;
  const todo = await shareService.getSharedTodo(token);

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center px-4">
      <SharedTodoCard todo={todo} />
    </main>
  );
};

export default SharedTodoPage;
