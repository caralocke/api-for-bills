# API-FOR-BILLS
A small API I'm currently working on for my bill tracker app

## API url: https://apiforbills.fly.dev/

### Bills:
[GET] /api/v1/bills returns an array ("bills") filled with objects (each a "bill"):
```js
[
    {
        "id": 0,
        "billName": "truck",
        "billAmount": "500.00",
        "dueDate": "2023-09-17"
    },
    {
        "id": 1,
        "billName": "house",
        "billAmount": "1200.00",
        "dueDate": "2023-09-01"
    },
    {
        "id": 2,
        "billName": "Verizon",
        "billAmount": "500.00",
        "dueDate": "2023-09-01"
    }
]
```
#### Bills: 
| Method   | URL                | Description                                                                                            |
| ------   | --------------     | ------------------------------------------------------------------------------------------------------ |
| [GET]    | /api/v1/bills      | Returns an array filled with bill objects.                                                             |
| [GET]    | /api/v1/bills/:id  | Returns the bill object with the specified `id`.                                                       |
| [DELETE] | /api/v1/bills/:id  | Removes the bill with the specified `id` and returns the deleted bill.                                 |
| [PUT]    | /api/v1/bills/:id  | Updates the bill with the specified `id` using data from the `request body`. Returns the modified bill |
