package com.mycompany.erequest.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class TicketTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Ticket getTicketSample1() {
        return new Ticket()
            .id(1L)
            .flowId(1L)
            .ticketName("ticketName1")
            .creatorEmail("creatorEmail1")
            .currentStepId(1L)
            .status(1)
            .priority(1)
            .version(1);
    }

    public static Ticket getTicketSample2() {
        return new Ticket()
            .id(2L)
            .flowId(2L)
            .ticketName("ticketName2")
            .creatorEmail("creatorEmail2")
            .currentStepId(2L)
            .status(2)
            .priority(2)
            .version(2);
    }

    public static Ticket getTicketRandomSampleGenerator() {
        return new Ticket()
            .id(longCount.incrementAndGet())
            .flowId(longCount.incrementAndGet())
            .ticketName(UUID.randomUUID().toString())
            .creatorEmail(UUID.randomUUID().toString())
            .currentStepId(longCount.incrementAndGet())
            .status(intCount.incrementAndGet())
            .priority(intCount.incrementAndGet())
            .version(intCount.incrementAndGet());
    }
}
