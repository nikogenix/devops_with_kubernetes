import { gql } from "@apollo/client";

const TODO_DETAILS = gql`
	fragment TodoDetails on Todo {
		task
		complete
	}
`;

export const ALL_TODOS = gql`
	query {
		todos {
			...TodoDetails
		}
	}
	${TODO_DETAILS}
`;

export const ADD_TODO = gql`
	mutation AddTodo($task: String!) {
		addTodo(task: $task) {
			...TodoDetails
		}
	}
	${TODO_DETAILS}
`;
