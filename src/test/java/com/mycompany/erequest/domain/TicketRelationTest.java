package com.mycompany.erequest.domain;

import static com.mycompany.erequest.domain.TicketRelationTestSamples.*;
import static com.mycompany.erequest.domain.TicketTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.erequest.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TicketRelationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TicketRelation.class);
        TicketRelation ticketRelation1 = getTicketRelationSample1();
        TicketRelation ticketRelation2 = new TicketRelation();
        assertThat(ticketRelation1).isNotEqualTo(ticketRelation2);

        ticketRelation2.setId(ticketRelation1.getId());
        assertThat(ticketRelation1).isEqualTo(ticketRelation2);

        ticketRelation2 = getTicketRelationSample2();
        assertThat(ticketRelation1).isNotEqualTo(ticketRelation2);
    }

    @Test
    void ticketTest() {
        TicketRelation ticketRelation = getTicketRelationRandomSampleGenerator();
        Ticket ticketBack = getTicketRandomSampleGenerator();

        ticketRelation.setTicket(ticketBack);
        assertThat(ticketRelation.getTicket()).isEqualTo(ticketBack);

        ticketRelation.ticket(null);
        assertThat(ticketRelation.getTicket()).isNull();
    }
}
