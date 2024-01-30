import Logger from "./Logger.mjs";
import Settings from "./Settings.mjs";

export default class SettingsForm extends FormApplication {
	constructor(object, options = {}) {
		super(object, options);
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			id: "defaultmoods-settings-form",
			title: "ViNo Default Moods",
			template: "./modules/vino/templates/mood-settings.html",
			classes: ["sheet"],
			width: 500,
			closeOnSubmit: true
		});
	}

	async getData() {
		let storedMoods = await Settings.getAllDefaultMoods();

		const data = {
			moods: this._getIndexValueList(storedMoods),
			cantRemove: storedMoods.length === 0
		};

		Logger.log(data);

		return data;
	}

	/**
	 * Executes on form submission.
	 * @param {object} e the form submission event
	 * @param {object} d the form data
	 */
	async _updateObject(e, d) {
		let buttonPressed = $(document.activeElement).val();

		Logger.logObject(buttonPressed);

		Logger.logObject(d);
		let values = Object.values(d);
		Logger.logObject(values);
		await Settings.set("defaultMoods", values);
	}

	activateListeners(html) {
		super.activateListeners(html);

		$(".mood-add").click(function () {
			Settings.addDefaultMood("blank");
		});

		$(".mood-delete").click(function () {
			let moodId = $(this).data("moodid");
			$(this).parent()
				.remove();
			Settings.removeDefaultMood(moodId);
		});
	}

	_getIndexValueList(array) {
		let options = [];
		array.forEach((x, i) => {
			options.push({ value: x, index: i + 1 });
		});
		return options;
	}
}
