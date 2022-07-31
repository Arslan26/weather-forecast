export const validInput = value => {
    return value === '' || (/^\d+$/.test(value) && value.length <= 5)
}