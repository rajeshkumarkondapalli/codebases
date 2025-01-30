<#assign myMap = {"name": "John Doe", "age": 30, "city": "New York"}>
<#assign keyName = "age">  <#-- Assign the *string* "age" to the variable keyName -->

Value associated with the key "${keyName}": ${myMap[keyName]} <#-- Output: Value associated with the key "age": 30 -->

<#-- Another example: -->
<#assign dynamicKey = "city">

Value associated with the key "${dynamicKey}": ${myMap[dynamicKey]} <#-- Output: Value associated with the key "city": New York -->


<#-- Handling missing keys (important!): -->
<#assign nonExistentKey = "country">

<#if myMap?has_key(nonExistentKey)> <#-- Use ?has_key or ?exists -->
  Value associated with the key "${nonExistentKey}": ${myMap[nonExistentKey]}
<#else>
  Value associated with the key "${nonExistentKey}": Not found
</#if>

<#-- Or using the default value operator !: -->
Value associated with the key "${nonExistentKey}": ${myMap[nonExistentKey]!"Default Value"} <#-- Output: Value associated with the key "country": Default Value -->









<#assign strings = ["1R2C_PD-1000_v01_CHILD", "1R2C_PD-1000_v01"]>
<#assign pd_value = "PD">
<#assign num_value = "1000">

<#list strings as str>
  <#if str?matches("^1R2C_${pd_value}-${num_value}_v\\d{2}(_CHILD)?\$")>
    <#assign parts = str?split("_")>
    PD: ${parts[1]?split("-")[0]}, Value: ${parts[1]?split("-")[1]}
  <#else>
    No match found for ${str}
  </#if>
</#list>



