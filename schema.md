| accounts/{accountId} |
| --- |
| displayName (string) |
| username (string) |
| createdAt (timestamp) |
| updatedAt (timestamp) |
| isAdmin (boolean) |
| apiKey (string) |
| encryption (map) eg. { encryptedPrivateKey (string), publicKey } |
| storageSize (number) |
| entriesCount (number) |

| entries/{entryId} |
| --- |
| date (date) |
| text (string) |
| accountRef (reference to account) |

