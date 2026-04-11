package com.mycompany.erequest.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class TicketStepTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static TicketStep getTicketStepSample1() {
        return new TicketStep().id(1L).nodeId(1L).performerEmail("performerEmail1").status(1);
    }

    public static TicketStep getTicketStepSample2() {
        return new TicketStep().id(2L).nodeId(2L).performerEmail("performerEmail2").status(2);
    }

    public static TicketStep getTicketStepRandomSampleGenerator() {
        return new TicketStep()
            .id(longCount.incrementAndGet())
            .nodeId(longCount.incrementAndGet())
            .performerEmail(UUID.randomUUID().toString())
            .status(intCount.incrementAndGet());
    }
}
