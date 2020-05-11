import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "keyValueStartsWith",
})
export class KeyValueStartsWithPipe implements PipeTransform {
	transform(items: any[], key: string, valueStart: string, negative = false) {
		if (!items || !key || !valueStart) return items;

		return items.filter(item => {
			if (typeof item[key] != "string") return false;
			const startsWith = item[key].startsWith(valueStart);
			return negative ? !startsWith : startsWith;
		});
	}
}
