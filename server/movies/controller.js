const mapping = {
    'invalid_type': 400,
}

/**
 * @param {import('zod').ZodError} err
 * @param {import('express').Response} res
 */
export function errResponse(err, res) {
    const error = err.errors[0]
    res.statusCode = mapping[error.code] || 400;
    res.end()
}
