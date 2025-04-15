export class ContactModel {
	private email: string = '';
	private phone: string = '';

	setContact(email: string, phone: string) {
		this.email = email;
		this.phone = phone;
	}

	checkEmail(email: string) {
		const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9-]+\.[A-Z]{2,4}$/i; 
		return emailPattern.test(email);
	}

	checkPhone(phone: string) {
		const phonePattern = /^\+7\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
		return phonePattern.test(phone);
	}

	isValid(): boolean {
		return this.checkEmail(this.email) && this.checkPhone(this.phone);
	}

	getValidationErrors() {
		const errors: { email?: string; phone?: string } = {};
		if (!this.checkEmail(this.email)) {
			errors.email = 'Введите корректный email';
		}
		if (!this.checkPhone(this.phone)) {
			errors.phone = 'Введите корректный номер телефона';
		}
		return errors;
	}

	getEmail() {
		return this.email;
	}

	getPhone() {
		return this.phone;
	}

	clear() {
		this.email = '';
		this.phone = '';
}
}