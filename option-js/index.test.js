test('creating with value is some', (_) => {
	const value = 1;
	const option = Option.some(value);
	assert.strictEqual(option.unwrap(), value);
	assert.ok(option.isSome());
	assert.ok(!option.isNone());
});

test('creating with no value is none', (_) => {
	const option1 = Option.none();
	assert.ok(!option1.isSome());
	assert.ok(option1.isNone());

	const value = null;
	const option2 = Option.some(value);
	assert.ok(!option2.isSome());
	assert.ok(option2.isNone());
});

test('creating with no value and unwrapping fails', (_) => {
	const err = new Error('Option is None');
	const option1 = Option.none();
	try {
		option1.unwrap();
	} catch (error) {
		assert.equal(error.message, err.message);
	}
	assert.ok(!option1.isSome());
	assert.ok(option1.isNone());

	const value = null;
	const option2 = Option.some(value);
	try {
		option1.unwrap();
	} catch (error) {
		assert.equal(error.message, err.message);
	}
	assert.ok(!option2.isSome());
	assert.ok(option2.isNone());
});

test('creating with value and unwrapOr gives value', (_) => {
	const value = 1;
	const option1 = Option.some(value);
	assert.strictEqual(option1.unwrapOr(2), value);
	assert.ok(option1.isSome());
	assert.ok(!option1.isNone());
});


test('creating with no value and unwrapOr gives default', (_) => {
	const value = 1;
	const option1 = Option.none();
	assert.strictEqual(option1.unwrapOr(value), value);
	assert.ok(!option1.isSome());
	assert.ok(option1.isNone());

	const option2 = Option.some(null);
	assert.strictEqual(option1.unwrapOr(value), value);
	assert.ok(!option2.isSome());
	assert.ok(option2.isNone());
});
