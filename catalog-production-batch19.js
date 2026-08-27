// v8.9 production catalog batch 19
// Refresh legacy/base catalog products after Yodobashi sale-state checks and
// manufacturer specification verification on 2026-08-28.
(function(){
  const patches={
    "NR-E47BR3-C":{price:198000,verifiedAt:"2026-08-28"},
    "NR-E47BR3L-C":{price:198000,verifiedAt:"2026-08-28"},
    "NR-F55HY3-N":{price:287100,verifiedAt:"2026-08-28"},
    "MR-MZ49N-H":{price:330000,verifiedAt:"2026-08-28"},
    "R-HWS47X N":{price:218000,smartphone:false,verifiedAt:"2026-08-28"},
    "R-HWS47XL N":{price:218000,smartphone:false,verifiedAt:"2026-08-28"},
    "GR-Y510FK(EW)":{price:172710,verifiedAt:"2026-08-28"},
    "SJ-MF43R-H":{price:258000,verifiedAt:"2026-08-28"},
    "AQR-V43A(S)":{price:145850,verifiedAt:"2026-08-28"},
    "AQR-V43AL(S)":{price:145850,verifiedAt:"2026-08-28"}
  };

  for(const product of products){
    const patch=patches[product.model];
    if(patch) Object.assign(product,patch);
  }
})();
