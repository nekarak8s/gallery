package com.nekarak8s.post.app.util.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitUtil {
    private final Map<Long, Bucket> buckets = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();


    public Bucket getBucket(long memberId) {
        Bucket bucket = buckets.get(memberId);

        if (bucket == null) {
            Refill refill = Refill.intervally(2, Duration.ofSeconds(3));
            Bandwidth limit = Bandwidth.classic(3, refill);
            Bucket newBucket = Bucket.builder()
                    .addLimit(limit)
                    .build();
            putWithTTL(memberId, newBucket, 300, TimeUnit.SECONDS);
            bucket = newBucket;
        }

        return bucket;
    }

    private void putWithTTL(long key, Bucket bucket, long ttl, TimeUnit timeUnit) {
        buckets.put(key, bucket);
        scheduler.schedule(() -> buckets.remove(key), ttl, timeUnit);
    }
}
