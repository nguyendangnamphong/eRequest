package com.mycompany.erequest.domain;

import static com.mycompany.erequest.domain.TicketSLATestSamples.*;
import static com.mycompany.erequest.domain.TicketStepTestSamples.*;
import static com.mycompany.erequest.domain.TicketTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.erequest.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TicketSLATest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TicketSLA.class);
        TicketSLA ticketSLA1 = getTicketSLASample1();
        TicketSLA ticketSLA2 = new TicketSLA();
        assertThat(ticketSLA1).isNotEqualTo(ticketSLA2);

        ticketSLA2.setId(ticketSLA1.getId());
        assertThat(ticketSLA1).isEqualTo(ticketSLA2);

        ticketSLA2 = getTicketSLASample2();
        assertThat(ticketSLA1).isNotEqualTo(ticketSLA2);
    }

    @Test
    void stepTest() {
        TicketSLA ticketSLA = getTicketSLARandomSampleGenerator();
        TicketStep ticketStepBack = getTicketStepRandomSampleGenerator();

        ticketSLA.setStep(ticketStepBack);
        assertThat(ticketSLA.getStep()).isEqualTo(ticketStepBack);
        assertThat(ticketStepBack.getSla()).isEqualTo(ticketSLA);

        ticketSLA.step(null);
        assertThat(ticketSLA.getStep()).isNull();
        assertThat(ticketStepBack.getSla()).isNull();
    }

    @Test
    void ticketTest() {
        TicketSLA ticketSLA = getTicketSLARandomSampleGenerator();
        Ticket ticketBack = getTicketRandomSampleGenerator();

        ticketSLA.setTicket(ticketBack);
        assertThat(ticketSLA.getTicket()).isEqualTo(ticketBack);

        ticketSLA.ticket(null);
        assertThat(ticketSLA.getTicket()).isNull();
    }
}
