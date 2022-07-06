import Router from "next/router";

export function goToIndexOnEscape(event: KeyboardEvent) {
	if (event.defaultPrevented) {
		return;
	}
	if (event.code == 'Escape') {
		Router.push("/");
	}
}