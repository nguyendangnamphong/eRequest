package com.mycompany.erequest.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class TicketSLATestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static TicketSLA getTicketSLASample1() {
        return new TicketSLA().id(1L);
    }

    public static TicketSLA getTicketSLASample2() {
        return new TicketSLA().id(2L);
    }

    public static TicketSLA getTicketSLARandomSampleGenerator() {
        return new TicketSLA().id(longCount.incrementAndGet());
    }
}
