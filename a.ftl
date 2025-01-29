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



