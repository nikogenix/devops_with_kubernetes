import { useMutation, useQuery } from "@apollo/client";

import { ALL_TODOS, ADD_TODO } from "../queries";
import { useState } from "react";

const Todos = () => {
	const todos = useQuery(ALL_TODOS);

	const [task, setTask] = useState("");

	const [addTodo] = useMutation(ADD_TODO, {
		refetchQueries: [{ query: ALL_TODOS }],
		onCompleted: () => {
			setTask("");
		},
	});

	const submit = async (e) => {
		e.preventDefault();
		addTodo({ variables: { task } });
	};

	if (todos.loading) {
		return <div>loading...</div>;
	}

	if (todos === undefined) {
		return <div>no todos yet...</div>;
	}

	return (
		<>
			<form onSubmit={submit}>
				<input
					required
					value={task}
					onChange={({ target }) => setTask(target.value)}
					type="text"
					placeholder="new todo"
				/>
				<button type="submit">add</button>
			</form>
			<ul id="list">
				{todos?.data &&
					todos.data.todos.map((t) => (
						<li key={t.task} style={{ textDecoration: t.complete && "line-through" }}>
							{t.task}
						</li>
					))}
			</ul>
		</>
	);
};

export default Todos;
