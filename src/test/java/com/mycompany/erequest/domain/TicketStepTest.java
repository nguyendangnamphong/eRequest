package com.mycompany.erequest.domain;

import static com.mycompany.erequest.domain.TicketSLATestSamples.*;
import static com.mycompany.erequest.domain.TicketStepTestSamples.*;
import static com.mycompany.erequest.domain.TicketTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.erequest.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TicketStepTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TicketStep.class);
        TicketStep ticketStep1 = getTicketStepSample1();
        TicketStep ticketStep2 = new TicketStep();
        assertThat(ticketStep1).isNotEqualTo(ticketStep2);

        ticketStep2.setId(ticketStep1.getId());
        assertThat(ticketStep1).isEqualTo(ticketStep2);

        ticketStep2 = getTicketStepSample2();
        assertThat(ticketStep1).isNotEqualTo(ticketStep2);
    }

    @Test
    void slaTest() {
        TicketStep ticketStep = getTicketStepRandomSampleGenerator();
        TicketSLA ticketSLABack = getTicketSLARandomSampleGenerator();

        ticketStep.setSla(ticketSLABack);
        assertThat(ticketStep.getSla()).isEqualTo(ticketSLABack);

        ticketStep.sla(null);
        assertThat(ticketStep.getSla()).isNull();
    }

    @Test
    void ticketTest() {
        TicketStep ticketStep = getTicketStepRandomSampleGenerator();
        Ticket ticketBack = getTicketRandomSampleGenerator();

        ticketStep.setTicket(ticketBack);
        assertThat(ticketStep.getTicket()).isEqualTo(ticketBack);

        ticketStep.ticket(null);
        assertThat(ticketStep.getTicket()).isNull();
    }
}
