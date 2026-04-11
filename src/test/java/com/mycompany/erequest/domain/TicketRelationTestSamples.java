package com.mycompany.erequest.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class TicketRelationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static TicketRelation getTicketRelationSample1() {
        return new TicketRelation().id(1L).relatedTicketId(1L);
    }

    public static TicketRelation getTicketRelationSample2() {
        return new TicketRelation().id(2L).relatedTicketId(2L);
    }

    public static TicketRelation getTicketRelationRandomSampleGenerator() {
        return new TicketRelation().id(longCount.incrementAndGet()).relatedTicketId(longCount.incrementAndGet());
    }
}
