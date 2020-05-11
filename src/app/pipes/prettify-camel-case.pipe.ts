import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "prettifyCamelCase",
})
export class PrettifyCamelCasePipe implements PipeTransform {
	transform(camelCase: string) {
		const formatted: string[] = [];
		const chars = camelCase.split("");

		for (const char of chars) {
			if (char.toUpperCase() == char) formatted.push(" ");
			formatted.push(char.toLowerCase());
		}

		return (
			formatted.join("").slice(0, 1).toUpperCase() +
			formatted.join("").slice(1).toLowerCase()
		);
	}
}
