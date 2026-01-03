**Correct Java Structure for All Problems**

```java
// BOILERPLATE_HIDDEN_START
import java.util.*;
import java.io.*;

public class Main {
// BOILERPLATE_HIDDEN_END

// USER_CODE_START
    /**
     * @param int[] nums
     * @param int target
     * @return int
     */
    public static int threeSumClosest(int[] nums, int target) {
        // Write your code here
        return 0;
    }
// USER_CODE_END

// BOILERPLATE_HIDDEN_START
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String[] firstLine = br.readLine().split(" ");
        int n = Integer.parseInt(firstLine[0]);
        int target = Integer.parseInt(firstLine[1]);
        
        String[] numsStr = br.readLine().split(" ");
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = Integer.parseInt(numsStr[i]);
        }
        
        int result = threeSumClosest(nums, target);
        System.out.println(result);
    }
}
// BOILERPLATE_HIDDEN_END
```

**What students see (ONLY):**
```java
    /**
     * @param int[] nums
     * @param int target
     * @return int
     */
    public static int threeSumClosest(int[] nums, int target) {
        // Write your code here
        return 0;
    }
```

**No class wrapper! Just the method!** ✅

Apply this to **ALL** Java problems.
