# Return Values

Showcases the following:

* Calling contracts can use a return value.
* From Javascript:
 * We get a return value only when calling the non-constant function with `.call()`.
 * We get a transaction hash when simply calling the non-constant function.
* If a non-constant function is called with `.call()` and returns a storage variable, it is the unmodified variable that is returned.